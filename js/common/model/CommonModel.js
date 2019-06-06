// Copyright 2019, University of Colorado Boulder

/**
 * @author Martin Veillette
 */
define( require => {
  'use strict';

  // modules
  const Bounds2 = require( 'DOT/Bounds2' );
  const BooleanProperty = require( 'AXON/BooleanProperty' );
  const ComponentStyles = require( 'VECTOR_ADDITION/common/model/ComponentStyles' );
  const DerivedProperty = require( 'AXON/DerivedProperty' );
  const EnumerationProperty = require( 'AXON/EnumerationProperty' );
  const ObservableArray = require( 'AXON/ObservableArray' );
  const Property = require( 'AXON/Property' );
  const Vector = require( 'VECTOR_ADDITION/common/model/Vector' );
  const Vector2Property = require( 'DOT/Vector2Property' );
  const Vector2 = require( 'DOT/Vector2' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );
  const VectorOrientation = require( 'VECTOR_ADDITION/common/model/VectorOrientation' );
  const ModelViewTransform2 = require( 'PHETCOMMON/view/ModelViewTransform2' );

  // constants
  const UPPER_LEFT_LOCATION = new Vector2( 29, 90 );
  const MODEL_VIEW_SCALE = 12.5;

  /**
   * @constructor
   */
  class CommonModel {

    /**
     * @param {Dimension2} gridDimension - the dimensions for the graph
     * @param {Vector2} upperLeftLocation - the location of the upperLeft corner
     * @param {Tandem} tandem
     */
    constructor( gridDimension, upperLeftLocation, tandem ) {

      // @public {BooleanProperty}
      this.sumVisibleProperty = new BooleanProperty( false );

      // @public {BooleanProperty}
      this.valuesVisibleProperty = new BooleanProperty( false );

      // @public {BooleanProperty}
      this.gridVisibleProperty = new BooleanProperty( true );

      // @public {Property.<VectorOrientation>}
      this.vectorOrientationProperty = new Property( VectorOrientation.HORIZONTAL );

      // @public {EnumerationProperty<ComponentStyles>} - controls the visibility of the component styles
      this.componentStyleProperty = new EnumerationProperty( ComponentStyles, ComponentStyles.INVISIBLE );

      // @public {BooleanProperty} - controls the visibility of the angle
      this.angleVisibleProperty = new BooleanProperty( false );

      // @public {VectorProperty} - the location the top left corner of the grid
      this.upperLeftLocationProperty = new Vector2Property( upperLeftLocation );

      this.gridModelBounds;

      this.upperLeftLocationProperty.link( ( upperLeftLocation ) => {
        // @public {Bounds2} - the model bounds for the grid
        this.gridModelBounds = new Bounds2(
          upperLeftLocation.x,
          upperLeftLocation.y - gridDimension.height,
          upperLeftLocation.x + gridDimension.width,
          upperLeftLocation.y );

      } );


      // @public {Property.<ModelViewTransform2>} - the model-view transform of the simulation
      this.modelViewTransformProperty = new DerivedProperty( [ this.upperLeftLocationProperty ], ( upperLeftLocation ) =>
        ModelViewTransform2.createSinglePointScaleInvertedYMapping(
          upperLeftLocation, UPPER_LEFT_LOCATION, MODEL_VIEW_SCALE )
      );

      // @public {ObservableArray.<Vector>}
      this.vectors = new ObservableArray();

      const vectorA = new Vector( 5, 0, { label: 'a' } );
      const vectorB = new Vector( 5, 0, { label: 'b' } );
      const vectorC = new Vector( 5, 0, { label: 'c' } );

      this.vectors.addAll( [ vectorA, vectorB, vectorC ] );
    }

    // @public resets the model
    reset() {
      this.sumVisibleProperty.reset();
      this.valuesVisibleProperty.reset();
      this.gridVisibleProperty.reset();
      this.angleVisibleProperty.reset();

      this.upperLeftLocationProperty.reset();
    }
  }

  return vectorAddition.register( 'CommonModel', CommonModel );
} );