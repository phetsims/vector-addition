// Copyright 2019, University of Colorado Boulder

/**
 * Root class (to be subtyped) for the top level model of every screen respectively. Controls the state of the sim.
 *
 * Main responsibilities are:
 *  - Values visibility
 *  - Grid visibility
 *  - Angle visibility
 *  - Component style property
 *  - Coordinate snap mode property
 *
 * Meant as a superclass. Added properties in subclasses will not be reset in this class. Graphs and sum visibility
 * properties should be made in subclasses (varied amount of graphs and sum visibility properties from screen to
 * screen)
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
  const Tandem = require( 'TANDEM/Tandem' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );

  // constants
  const STARTING_COMPONENT_STYLE = ComponentStyles.INVISIBLE;
  const STARTING_COORDINATE_SNAP_MODE = CoordinateSnapModes.CARTESIAN;

  class VectorAdditionModel {
    /**
     * @constructor
     * @param {Tandem} tandem
     */
    constructor( tandem ) {

      assert && assert( tandem instanceof Tandem, `invalid tandem: ${tandem}` );

      // @public {BooleanProperty} - indicates if the labels should contain the magnitudes
      this.valuesVisibleProperty = new BooleanProperty( false );

      // @public {BooleanProperty} - indicates if the graph background grid is visible
      this.gridVisibleProperty = new BooleanProperty( true );

      // @public {BooleanProperty} - controls the visibility of the angle
      this.angleVisibleProperty = new BooleanProperty( false );

      //----------------------------------------------------------------------------------------

      // @public {EnumerationProperty.<ComponentStyles>} - controls the visibility of the component styles
      this.componentStyleProperty = new EnumerationProperty( ComponentStyles, STARTING_COMPONENT_STYLE );

      // @public {EnumerationProperty.<CoordinateSnapModes>} - controls the snapping mode for the vectors
      this.coordinateSnapModeProperty = new EnumerationProperty( CoordinateSnapModes, STARTING_COORDINATE_SNAP_MODE );
    }

    /**
     * Resets the model.
     * @public
     */
    reset() {
      this.valuesVisibleProperty.reset();
      this.gridVisibleProperty.reset();
      this.angleVisibleProperty.reset();
      this.componentStyleProperty.reset();
      this.coordinateSnapModeProperty.reset();
    }
  }

  return vectorAddition.register( 'VectorAdditionModel', VectorAdditionModel );
} );