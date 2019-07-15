// Copyright 2019, University of Colorado Boulder

/**
 * Factory for creating the various icons that appear in the sim.
 *
 * @author Brandon Li
 */

define( require => {
  'use strict';

  // modules
  const AlignBox = require( 'SCENERY/nodes/AlignBox' );
  const ArrowNode = require( 'SCENERY_PHET/ArrowNode' );
  const Bounds2 = require( 'DOT/Bounds2' );
  const ComponentStyles = require( 'VECTOR_ADDITION/common/model/ComponentStyles' );
  const CurvedArrowNode = require( 'VECTOR_ADDITION/common/view/CurvedArrowNode' );
  const EquationTypes = require( 'VECTOR_ADDITION/equation/model/EquationTypes' );
  const FontAwesomeNode = require( 'SUN/FontAwesomeNode' );
  const GraphOrientations = require( 'VECTOR_ADDITION/common/model/GraphOrientations' );
  const Line = require( 'SCENERY/nodes/Line' );
  const Node = require( 'SCENERY/nodes/Node' );
  const Path = require( 'SCENERY/nodes/Path' );
  const PhetFont = require( 'SCENERY_PHET/PhetFont' );
  const Shape = require( 'KITE/Shape' );
  const Text = require( 'SCENERY/nodes/Text' );
  const Util = require( 'DOT/Util' );
  const Vector2 = require( 'DOT/Vector2' );
  const vectorAddition = require( 'VECTOR_ADDITION/vectorAddition' );
  const VectorAdditionColors = require( 'VECTOR_ADDITION/common/VectorAdditionColors' );
  const VectorAdditionConstants = require( 'VECTOR_ADDITION/common/VectorAdditionConstants' );
  const VectorGroups = require( 'VECTOR_ADDITION/common/model/VectorGroups' );

  //----------------------------------------------------------------------------------------
  // constants

  // size (width and height) of all arrow nodes inside of radio buttons
  const RADIO_BUTTON_ARROW_SIZE = 29;

  // defaults for all arrow node instances
  const ARROW_ICON_OPTIONS = {
    fill: VectorAdditionColors[ VectorGroups.ONE ].fill,
    stroke: VectorAdditionColors.BLACK,
    lineWidth: 0.5,
    headHeight: 6.5,
    headWidth: 10.5,
    tailWidth: 3.9
  };

  // default font on text inside of icons that go in radio buttons
  const RADIO_BUTTON_TEXT_FONT = new PhetFont( { size: 11, family: 'Times', weight: '500' } );

  // default options for opaque arrows
  const OPAQUE_ARROW_OPTIONS = _.extend( {}, ARROW_ICON_OPTIONS, { opacity: 0.4 } );


  class VectorAdditionIconFactory {
    /**
     * Creates the Vector Icon that appears on the vector creator panel
     * @public
     * @param {Vector2} initialVectorComponents - vector components (in model coordinates)
     * @param {VectorGroups} vectorGroup - vector group of the vector that the icon represents
     * @param {Object} [options] - various key-value pairs that control the appearance of the icon
     * @returns {ArrowNode}
     */
    static createVectorCreatorPanelIcon( initialVectorComponents, vectorGroup, options ) {
      assert && assert( initialVectorComponents instanceof Vector2 );
      assert && assert( vectorGroup && VectorGroups.includes( vectorGroup ) );
      assert && assert( !options || Object.getPrototypeOf( options ) === Object.prototype );

      options = _.extend( {}, VectorAdditionConstants.VECTOR_OPTIONS, {
        // arrow node options
        tailWidth: 2.5,
        cursor: 'pointer',
        fill: VectorAdditionColors[ vectorGroup ].fill,

        // specific to this function
        arrowLength: 30 // {number} length of the arrow
      }, options );

      const vectorComponentsView = initialVectorComponents.normalized().timesScalar( options.arrowLength );
      return new ArrowNode( 0, 0, vectorComponentsView.x, vectorComponentsView.y, options );
    }

    /**
     * Creates the icon used on the radio buttons on 'Explore1D' that toggle the graph orientation (horizontal/vertical)
     * @public
     * @param (GraphOrientations} graphOrientation - orientation of the graph (has to be horizontal or vertical)
     * @param {Object} [options] - various key-value pairs that control the appearance of the icon
     * @returns {ArrowNode}
     */
    static createGraphOrientationIcon( graphOrientation, options ) {
      assert && assert( graphOrientation && GraphOrientations.includes( graphOrientation )
      && graphOrientation !== GraphOrientations.TWO_DIMENSONAL );
      assert && assert( !options || Object.getPrototypeOf( options ) === Object.prototype );

      options = _.extend( {
        // All options are for arrow node
        fill: VectorAdditionColors.BLACK,
        doubleHead: true,
        tailWidth: 3,
        headWidth: 8,
        headHeight: 10,
        arrowLength: 40
      }, options );

      //----------------------------------------------------------------------------------------
      if ( graphOrientation === GraphOrientations.HORIZONTAL ) {
        return new ArrowNode( 0, 0, options.arrowLength, 0, options );
      }
      else if ( graphOrientation === GraphOrientations.VERTICAL ) {
        return new ArrowNode( 0, 0, 0, options.arrowLength, options );
      }
    }

    /**
     * Creates the icon that appears next to the 'Sum' checkbox on the control panel
     * @public
     * @param {VectorGroups} vectorGroup
     * @param {Object} [options] - various key-value pairs that control the appearance of the icon
     * @returns {Node}
     */
    static createSumIcon( vectorGroup, options ) {
      assert && assert( vectorGroup && VectorGroups.includes( vectorGroup ) );
      assert && assert( !options || Object.getPrototypeOf( options ) === Object.prototype );

      options = _.extend( {}, ARROW_ICON_OPTIONS, {
        // for arrow node
        lineWidth: 1,
        tailWidth: 3.8,
        headHeight: 7.2,
        fill: VectorAdditionColors[ vectorGroup ].sum,

        // specific to this
        arrowLength: 22
      }, options );

      return new ArrowNode( 0, 0, options.arrowLength, 0, options );
    }

    /**
     * Creates the icon that appears next to the checkbox that toggles the 'Angle' visibility
     * @public
     * @param {Object} [options] - various key-value pairs that control the appearance of the icon
     * @returns {Node}
     */
    static createAngleIcon( options ) {
      assert && assert( !options || Object.getPrototypeOf( options ) === Object.prototype );

      options = _.extend( {
        // all are specific to this
        angle: Util.toRadians( 50 ), // {number} in radians
        curvedArrowRadius: 14, // {number}
        wedgeLength: 20, // {number} - length of the wedge
        curvedArrowOptions: null
      }, options );

      options.curvedArrowOptions = _.extend( {
        arrowheadWidth: 6,
        arrowheadHeight: 4.2,
        arcOptions: { lineWidth: 1.3 }
      }, options.curvedArrowOptions );

      // Create the wedge (bottom left as the origin)
      const wedgeShape = new Shape().moveTo( options.wedgeLength, 0 )
        .horizontalLineTo( 0 )
        .lineTo( Math.cos( options.angle ) * options.wedgeLength, -Math.sin( options.angle ) * options.wedgeLength );

      return new Node().setChildren( [ new Path( wedgeShape, { stroke: VectorAdditionColors.BLACK } ),
        new CurvedArrowNode( options.curvedArrowRadius, options.angle, options.curvedArrowOptions ) ] );
    }

    /**
     * Creates the icon that appears next to the checkbox that toggles the Grid visibility
     * @public
     * @param {Object} [options] - various key-value pairs that control the appearance of the icon
     * @returns {Node}
     */
    static createGridIcon( options ) {
      assert && assert( !options || Object.getPrototypeOf( options ) === Object.prototype );

      options = _.extend( {
        rows: 3, // {number}
        cols: 3, // {number}
        gridLineSpacing: 6, // {number} spacing between each grid line
        gridPathOptions: null // {object} defaults bellow
      }, options );

      options.gridPathOptions = _.extend( {
        stroke: VectorAdditionColors.GRID_ICON_COLOR // {string}
      }, options.gridPathOptions );

      const gridShape = new Shape();

      // Draw each row
      for ( let row = 0; row < options.rows; row++ ) {
        gridShape.moveTo( 0, row * ( options.gridLineSpacing ) + options.gridLineSpacing )
          .horizontalLineTo( ( options.cols + 1 ) * options.gridLineSpacing );
      }
      // Draw each col
      for ( let col = 0; col < options.cols; col++ ) {
        gridShape.moveTo( col * ( options.gridLineSpacing ) + options.gridLineSpacing, 0 )
          .verticalLineTo( ( options.rows + 1 ) * options.gridLineSpacing );
      }
      return new Path( gridShape, options.gridPathOptions );
    }

    /**
     * Creates a radio button icon with ensured alignment and correct bounds.
     * @private
     * @param {Node} icon
     * @param {Object} [options]
     * @returns {AlignBox}
     */
    static createRadioButtonIcon( icon, options ) {

      assert && assert( icon instanceof Node, `invalid icon: ${icon}` );
      assert && assert( !options || Object.getPrototypeOf( options ) === Object.prototype,
        `Extra prototype on Options: ${options}` );

      options = _.extend( {
        width: RADIO_BUTTON_ARROW_SIZE + 9.5,
        height: RADIO_BUTTON_ARROW_SIZE + 7.5,

        // for align box
        topMargin: 0,
        leftMargin: 0,
        alignX: 'center',
        alignY: 'center'
      }, options );

      return new AlignBox( icon, {
        alignBounds: new Bounds2( 0, 0, options.width, options.height ),
        topMargin: options.topMargin,
        leftMargin: options.leftMargin,
        alignX: options.alignX,
        alignY: options.alignY
      } );
    }

    /**
     * Creates the icons that appear on the component style radio button group
     * @public
     * @param {ComponentStyles} componentStyle
     * @param {Object} [options] - various key-value pairs that control the appearance of the icon
     * @returns {Node}
     */
    static createComponentStyleIcon( componentStyle, options ) {
      assert && assert( componentStyle && ComponentStyles.includes( componentStyle ) );
      assert && assert( !options || Object.getPrototypeOf( options ) === Object.prototype );
      switch( componentStyle ) {
        case ComponentStyles.INVISIBLE:
          return this.createInvisibleComponentStyleIcon( options );
        case ComponentStyles.PARALLELOGRAM:
          return this.createParallelogramComponentStyleIcon( options );
        case ComponentStyles.TRIANGLE:
          return this.createTriangleComponentStyleIcon( options );
        case ComponentStyles.ON_AXIS:
          return this.createOnAxisComponentStyleIcon( options );
        default:
          throw new Error( `invalid componentStyle: ${componentStyle}` );
      }
    }

    /**
     * Creates the Icon for the invisible component display style on the component radio button
     * @private
     * @param {Object} [options] - various key-value pairs that control the appearance of the icon
     * @returns {Node}
     */
    static createInvisibleComponentStyleIcon( options ) {
      assert && assert( !options || Object.getPrototypeOf( options ) === Object.prototype );

      options = _.extend( { maxWidth: RADIO_BUTTON_ARROW_SIZE + 7.5 } );
      return this.createRadioButtonIcon( new FontAwesomeNode( 'eye_close', options ) );
    }

    /**
     * Creates the Icon for the parallelogram component radio button
     * @private
     * @param {Object} [options] - various key-value pairs that control the appearance of the icon
     * @returns {Node}
     */
    static createParallelogramComponentStyleIcon( options ) {
      assert && assert( !options || Object.getPrototypeOf( options ) === Object.prototype );

      const vectorArrow = new ArrowNode( 0, 0, RADIO_BUTTON_ARROW_SIZE, -RADIO_BUTTON_ARROW_SIZE, ARROW_ICON_OPTIONS );
      const xComponentArrow = new ArrowNode( 0, 0, RADIO_BUTTON_ARROW_SIZE, 0, OPAQUE_ARROW_OPTIONS );
      const yComponentArrow = new ArrowNode( 0, 0, 0, -RADIO_BUTTON_ARROW_SIZE, OPAQUE_ARROW_OPTIONS );

      return this.createRadioButtonIcon( new Node( _.extend( {
        children: [ xComponentArrow, yComponentArrow, vectorArrow ]
      }, options ) ) );
    }

    /**
     * Creates the Icon for the triangle component radio button
     * @private
     * @param {Object} [options] - various key-value pairs that control the appearance of the icon
     * @returns {Node}
     */
    static createTriangleComponentStyleIcon( options ) {
      assert && assert( !options || Object.getPrototypeOf( options ) === Object.prototype );

      const vectorArrow = new ArrowNode( 0, 0, RADIO_BUTTON_ARROW_SIZE, -RADIO_BUTTON_ARROW_SIZE, ARROW_ICON_OPTIONS );
      const xComponentArrow = new ArrowNode( 0, 0, RADIO_BUTTON_ARROW_SIZE, 0, OPAQUE_ARROW_OPTIONS );
      const yComponentArrow = new ArrowNode( RADIO_BUTTON_ARROW_SIZE, 0, RADIO_BUTTON_ARROW_SIZE,
        -RADIO_BUTTON_ARROW_SIZE, OPAQUE_ARROW_OPTIONS );

      return this.createRadioButtonIcon( new Node( _.extend( {
        children: [ xComponentArrow, yComponentArrow, vectorArrow ]
      }, options ) ) );
    }

    /**
     * Creates the Icon for the on axis component radio button
     * @private
     * @param {Object} [options] - various key-value pairs that control the appearance of the icon
     * @returns {Node}
     */
    static createOnAxisComponentStyleIcon( options ) {
      assert && assert( !options || Object.getPrototypeOf( options ) === Object.prototype );
      options = _.extend( {
        subBoxSize: 10,
        lineDash: [ 2, 2 ],
        stroke: VectorAdditionColors.BLACK
      }, options );

      const vectorArrow = new ArrowNode( options.subBoxSize,
        -options.subBoxSize,
        RADIO_BUTTON_ARROW_SIZE,
        -RADIO_BUTTON_ARROW_SIZE,
        ARROW_ICON_OPTIONS );

      const xArrow = new ArrowNode( options.subBoxSize, 0, RADIO_BUTTON_ARROW_SIZE, 0, OPAQUE_ARROW_OPTIONS );
      const yArrow = new ArrowNode( 0, -options.subBoxSize, 0, -RADIO_BUTTON_ARROW_SIZE, OPAQUE_ARROW_OPTIONS );

      const dashedLineShape = new Shape().moveTo( 0, -options.subBoxSize )
        .horizontalLineTo( options.subBoxSize )
        .verticalLineToRelative( options.subBoxSize )
        .moveTo( 0, -RADIO_BUTTON_ARROW_SIZE )
        .horizontalLineTo( RADIO_BUTTON_ARROW_SIZE )
        .verticalLineToRelative( RADIO_BUTTON_ARROW_SIZE );

      const dashedLinePath = new Path( dashedLineShape, { lineDash: options.lineDash, stroke: options.stroke } );

      return this.createRadioButtonIcon( new Node().setChildren( [ xArrow, yArrow, dashedLinePath, vectorArrow ] ) );
    }

    /**
     * Creates the Icon for the cartesian coordinate snap mode radio button
     * @public
     * @param {Object} [options] - various key-value pairs that control the appearance of the icon
     * @returns {Node}
     */
    static createCartesianIcon( options ) {
      assert && assert( !options || Object.getPrototypeOf( options ) === Object.prototype );

      options = _.extend( {
        arrowSize: 25, // {number}
        topMargin: 5, // {number}
        leftMargin: 1.4, // {number}
        labelArrowMargin: 2, // {number}
        offsetYLabel: 3, // {number}
        componentArrowOptions: null,
        cartesianArrowOptions: null
      }, options );
      options.cartesianArrowOptions = _.extend( {}, ARROW_ICON_OPTIONS, {
        lineWidth: 0,
        headHeight: 7.5,
        tailWidth: 4.2
      } );
      options.componentArrowOptions = _.extend( {}, ARROW_ICON_OPTIONS, {
        fill: VectorAdditionColors.BLACK,
        tailWidth: 3.1,
        headHeight: 7.3,
        headWidth: 9.3
      }, options.componentArrowOptions );

      const arrowSize = options.arrowSize;

      const xArrow = new ArrowNode( 0, 0, arrowSize, 0, options.componentArrowOptions );
      const yArrow = new ArrowNode( arrowSize, 0, arrowSize, -arrowSize, options.componentArrowOptions );
      const cartesianArrow = new ArrowNode( 0, 0, arrowSize, -arrowSize, options.cartesianArrowOptions );

      const xLabel = new Text( '1', {
        font: RADIO_BUTTON_TEXT_FONT,
        top: xArrow.centerY,
        centerX: xArrow.centerX
      } );
      const yLabel = new Text( '1', {
        font: RADIO_BUTTON_TEXT_FONT,
        centerY: yArrow.centerY + options.offsetYLabel,
        left: yArrow.centerX + options.labelArrowMargin
      } );

      return this.createRadioButtonIcon( new Node().setChildren( [ xArrow, yArrow, cartesianArrow, xLabel, yLabel ] ), {
        topMargin: options.topMargin,
        leftMargin: options.leftMargin
      } );
    }

    /**
     * Creates the Icon for the cartesian coordinate polar mode radio button
     * @public
     * @param {Object} [options] - various key-value pairs that control the appearance of the icon
     * @returns {Node}
     */
    static createPolarIcon( options ) {
      assert && assert( !options || Object.getPrototypeOf( options ) === Object.prototype );
      options = _.extend( {}, ARROW_ICON_OPTIONS, {
        arcRadius: 17,
        curvedArrowOptions: null,
        polarVectorOptions: null,
        arrowSize: 27.5
      }, options );

      options.polarVectorOptions = _.extend( {}, ARROW_ICON_OPTIONS, {
        lineWidth: 0,
        headHeight: 7.5,
        tailWidth: 4.2,
        fill: VectorAdditionColors.PURPLE
      } );

      options.curvedArrowOptions = _.extend( {
        arrowheadWidth: 5.5, // {number}
        arrowheadHeight: 5, // {number}
        arcOptions: { lineWidth: 1.2 }
      }, options.curvedArrowOptions );

      const polarVector = new ArrowNode( 0, 0, options.arrowSize, -options.arrowSize, options.polarVectorOptions );
      const arcArrow = new CurvedArrowNode( options.arcRadius, Util.toRadians( 45 ), options.curvedArrowOptions );
      const line = new Line( 0, 0, options.arrowSize, 0, { stroke: VectorAdditionColors.BLACK } );

      const arrowLabel = new Text( '1', {
        bottom: polarVector.centerY,
        right: polarVector.centerX - 2,
        font: RADIO_BUTTON_TEXT_FONT
      } );

      return this.createRadioButtonIcon( new Node().setChildren( [ arrowLabel, polarVector, arcArrow, line ] ) );
    }

    /**
     * Creates the Icon that appears on the equation types radio button group
     * @public
     * @param {EquationTypes} equationType
     * @param {array.<string>} vector tags - array of the vector tags. It is assumed the last vector tag is the sum.
     * @param {Object} [options] - various key-value pairs that control the appearance of the icon
     * @returns {Node}
     */
    static createEquationTypesIcon( equationType, vectorTags, options ) {
      assert && assert( EquationTypes.includes( equationType ), `invalid equationType: ${equationType}` );
      assert && assert( vectorTags.filter( tag => typeof tag === 'string' ).length === vectorTags.length );
      assert && assert( !options || Object.getPrototypeOf( options ) === Object.prototype );

      options = _.extend( {
        font: new PhetFont( 12 ),
        width: 80,
        height: 20
      } );

      // insert signs (+/-/=) in between each tag (excluding the sum tag)
      const contentArray = _.flatMap( _.dropRight( vectorTags ), ( tag, index, array ) => {
        return index !== array.length - 1 ? [ tag, equationType === EquationTypes.SUBTRACTION ? '-' : '+' ] :
               tag;
      } );

      // Add the second half of the equation
      if ( equationType === EquationTypes.ADDITION || equationType === EquationTypes.SUBTRACTION ) {
        contentArray.push( '=', _.last( vectorTags ) );
      }
      else if ( equationType === EquationTypes.NEGATION ) {
        contentArray.push( '+', _.last( vectorTags ), '=', '0' );
      }

      return this.createRadioButtonIcon( new Text( _.join( contentArray, ' ' ), { font: options.font } ), {
        width: options.width,
        height: options.height
      } );
    }
  }

  vectorAddition.register( 'VectorAdditionIconFactory', VectorAdditionIconFactory );

  return VectorAdditionIconFactory;
} );