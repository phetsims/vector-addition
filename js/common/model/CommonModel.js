// Copyright 2019, University of Colorado Boulder

/**
 * Common model is the shared model for every Screen respectively. Its main responsibility is to control the state
 * of the simulation.
 *
 * The model is not specific for an individual scene as it toggles global 'settings' of the simulation. For example,
 * turning on the 'angle visible' option on the control panel means the angle is visible for every scene.
 *
 * The model can also have an unknown amount of scenes (see Scene.js for more documentation).
 *
 * @author Martin Veillette
 */
define( require => {
  'use strict';

  // modules
  const BooleanProperty = require( 'AXON/BooleanProperty' );
  const ComponentStyles = require( 'VECTOR_ADDITION/common/model/ComponentStyles' );
  const CoordinateSnapModes = require( 'VECTOR_ADDITION/common/model/CoordinateSnapModes' );
  const Dimension2 = require( 'DOT/Dimension2' );
  const EnumerationProperty = require( 'AXON/EnumerationProperty' );
  const Scene = require( 'VECTOR_ADDITION/common/model/Scene' );
  const Vector2 = require( 'DOT/Vector2' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );
  const VectorAdditionConstants = require( 'VECTOR_ADDITION/common/VectorAdditionConstants' );
  const VectorOrientations = require( 'VECTOR_ADDITION/common/model/VectorOrientations' );
  const VectorTypes = require( 'VECTOR_ADDITION/common/model/VectorTypes' );

  // constants
  const DEFAULT_COMPONENT_STYLE = VectorAdditionConstants.DEFAULT_COMPONENT_STYLE;
  const DEFAULT_COORDINATE_SNAP_MODE = VectorAdditionConstants.DEFAULT_COORDINATE_SNAP_MODE;

  class CommonModel {
    /**
     * @constructor
     * @param {Dimension2} graphDimension - the dimensions (width and height) of the graph
     * @param {Vector2} graphUpperLeftPosition - the model coordinates of the top left corner of the graph
     * @param {number} numberOfScenes - each model can have multiple scenes
     * @param {number} numberOfVectorSets - scenes can have multiple vectorSets
     * @param {Tandem} tandem
     */
    constructor(
      graphDimension,
      graphUpperLeftPosition,
      numberOfScenes,
      numberOfVectorSets,
      tandem ) {

      // check that the arguments are correct types
      assert && assert( graphDimension instanceof Dimension2,
        `invalid graphDimension: ${graphDimension}` );
      assert && assert( graphUpperLeftPosition instanceof Vector2,
        `invalid graphUpperLeftPosition: ${graphUpperLeftPosition}` );
      assert && assert( typeof numberOfScenes === 'number' && numberOfScenes > 0,
        `invalid numberOfScenes: ${numberOfScenes}` );
      assert && assert( typeof numberOfVectorSets === 'number' && numberOfVectorSets > 0,
        `invalid numberOfVectorSets: ${numberOfVectorSets}` );


      // @public {BooleanProperty}
      this.sumVisibleProperty = new BooleanProperty( false );

      // @public {BooleanProperty}
      this.valuesVisibleProperty = new BooleanProperty( false );

      // @public {BooleanProperty}
      this.gridVisibleProperty = new BooleanProperty( true );

      // @public {EnumerationProperty<ComponentStyles>} - controls the visibility of the component styles
      this.componentStyleProperty = new EnumerationProperty( ComponentStyles, DEFAULT_COMPONENT_STYLE );

      // @public {EnumerationProperty<CoordinateSnapModes>} - controls the snapping mode for the vectors
      this.coordinateSnapModeProperty = new EnumerationProperty( CoordinateSnapModes, DEFAULT_COORDINATE_SNAP_MODE );

      // @public {BooleanProperty} - controls the visibility of the angle
      this.angleVisibleProperty = new BooleanProperty( false );


      // @public {EnumerationProperty.<VectorOrientations>} - controls the orientation of the vectors
      this.vectorOrientationProperty = new EnumerationProperty(
        VectorOrientations,
        VectorOrientations.TWO_DIMENSIONAL );


      // @public {array.<Scene>} scenes - array of the scenes
      this.scenes = [];

      // Method to create scenes, make this a separate method so sub-classes can override.
      // Currently, 1D model overrides this to give a vector orientation for each scene.
      this.createScenes(
        graphDimension,
        graphUpperLeftPosition,
        numberOfScenes,
        numberOfVectorSets );

      // Make sure that that the scenes were added correctly
      assert && assert( this.scenes.filter( scene => scene instanceof Scene ).length === numberOfScenes,
        'Invalid scenes created at this.createScenes' );

      // @public (read-only)
      this.numberOfVectorSets = numberOfVectorSets;

    }

    /**
     * @public
     * Reset the common model.
     */
    reset() {
      this.sumVisibleProperty.reset();
      this.valuesVisibleProperty.reset();
      this.gridVisibleProperty.reset();
      this.angleVisibleProperty.reset();
      this.componentStyleProperty.reset();

      // reset every scene in this.scenes
      this.scenes.forEach( ( scene ) => {
        scene.reset();
      } );
    }

    /**
     * @private
     * Create the scenes
     * Make a separate method (can be overridden if the scenes need a specific orientation, see Explore1DModel)
     * @param {Dimension2} graphDimension - the dimensions (width and height) of the graph
     * @param {Vector2} graphUpperLeftPosition - the model coordinates of the top left corner of the graph
     * @param {number} numberOfScenes - each model can have multiple scenes
     * @param {number} numberOfVectorSets - scenes can have multiple vectorSets
     */
    createScenes(
      graphDimension,
      graphUpperLeftPosition,
      numberOfScenes,
      numberOfVectorSets ) {

      for ( let i = 0; i < numberOfScenes; i++ ) {
        this.scenes.push( new Scene( graphDimension, graphUpperLeftPosition, numberOfVectorSets, this.componentStyleProperty, VectorTypes.ONE ) );
      }

    }
  }

  return vectorAddition.register( 'CommonModel', CommonModel );
} );