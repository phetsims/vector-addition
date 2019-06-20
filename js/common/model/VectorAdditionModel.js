// Copyright 2019, University of Colorado Boulder

/**
 * The shared model for every Screen respectively. Its main responsibility is to control the state
 * of the simulation.
 *
 * The model is not specific for an individual scene as it toggles global 'settings' of the simulation. For example,
 * turning on the 'angle visible' option on the control panel means the angle is visible for every scene.
 *
 * The model can also have an unknown amount of scenes (see Scene.js for more documentation).
 *
 * This is an abstract class that requires sub-class instances to define the scenes.
 *
 * @author Martin Veillette
 */
define( require => {
  'use strict';

  // modules
  const BooleanProperty = require( 'AXON/BooleanProperty' );
  const ComponentStyles = require( 'VECTOR_ADDITION/common/model/ComponentStyles' );
  const CoordinateSnapModes = require( 'VECTOR_ADDITION/common/model/CoordinateSnapModes' );
  const EnumerationProperty = require( 'AXON/EnumerationProperty' );
  const Scene = require( 'VECTOR_ADDITION/common/model/Scene' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );
  const VectorOrientations = require( 'VECTOR_ADDITION/common/model/VectorOrientations' );

  // constants
  const STARTING_COMPONENT_STYLE = ComponentStyles.INVISIBLE;
  const STARTING_COORDINATE_SNAP_MODE = CoordinateSnapModes.CARTESIAN;
  const STARTING_VECTOR_ORIENTATION = VectorOrientations.TWO_DIMENSIONAL;

  class VectorAdditionModel {
    /**
     * @constructor
     * @param {Tandem} tandem
     */
    constructor( tandem ) {

      //----------------------------------------------------------------------------------------
      // Visibility Properties
      // @public {BooleanProperty}
      this.valuesVisibleProperty = new BooleanProperty( false );

      // @public {BooleanProperty}
      this.gridVisibleProperty = new BooleanProperty( true );

      // @public {BooleanProperty} - controls the visibility of the angle
      this.angleVisibleProperty = new BooleanProperty( false );

      // The Sum Visibility Property is created in sub-classes since there is an unknown amount of sum visibility
      // properties. Example: the Lab screen has two sum visibility properties
      this.createSumVisibilityProperties();


      //----------------------------------------------------------------------------------------
      // Enumeration Properties
      // @public {EnumerationProperty<ComponentStyles>} - controls the visibility of the component styles
      this.componentStyleProperty = new EnumerationProperty( ComponentStyles, STARTING_COMPONENT_STYLE );

      // @public {EnumerationProperty<CoordinateSnapModes>} - controls the snapping mode for the vectors
      this.coordinateSnapModeProperty = new EnumerationProperty( CoordinateSnapModes, STARTING_COORDINATE_SNAP_MODE );

      // @public {EnumerationProperty.<VectorOrientations>} - controls the orientation of the vectors
      this.vectorOrientationProperty = new EnumerationProperty( VectorOrientations, STARTING_VECTOR_ORIENTATION );


      //----------------------------------------------------------------------------------------
      // Create the scenes

      // @public {array.<Scene>} scenes - array of the scenes
      this.scenes = [];

      // Method to create scenes. Since there is an unknown amount of scenes, call an abstract method to create the
      // scenes. Example: Explore1D has a vertical and a horizontal scene.
      this.createScenes();

      // Make sure that that the scenes were added correctly
      assert && assert( this.scenes.filter( scene => !( scene instanceof Scene ) ).length === 0,
        'Invalid scenes created at this.createScenes' );

    }

    /**
     * @public
     * Reset the VectorAdditionModel
     */
    reset() {

      // Reset the visible properties
      this.valuesVisibleProperty.reset();
      this.gridVisibleProperty.reset();
      this.angleVisibleProperty.reset();

      // Call an abstract method to reset the sum visibility properties
      this.resetSumVisibilityProperties();

      // Reset the enumeration properties
      this.componentStyleProperty.reset();
      this.coordinateSnapModeProperty.reset();
      this.vectorOrientationProperty.reset();

      // Reset every scene
      this.scenes.forEach( ( scene ) => {
        scene.reset();
      } );
    }

    /**
     * @abstract
     * @private
     * Create the Sum Visibility properties. Since there is an unknown amount of sum visibility, use an abstract method to create them.
     * Sub-classes MUST implement this method
     */
    createSumVisibilityProperties() { throw new Error( 'createSumVisibilityProperties must be implemented by sub classes' ); }

    /**
     * @abstract
     * @private
     * Create the scenes. Since there is an unknown amount of scenes, use an abstract method to create them.
     * Sub-classes MUST implement this method
     */
    createScenes() { throw new Error( 'createScenes must be implemented by sub classes' ); }

    /**
     * @abstract
     * @private
     * Reset the sum visibility properties. Since there is an unknown amount of properties, use an abstract method to
     * reset them.
     * Sub-classes MUST implement this method
     */
    resetSumVisibilityProperties() { throw new Error( 'resetSumVisibilityProperties( must be implemented by sub classes' ); }

  }

  return vectorAddition.register( 'VectorAdditionModel', VectorAdditionModel );
} );